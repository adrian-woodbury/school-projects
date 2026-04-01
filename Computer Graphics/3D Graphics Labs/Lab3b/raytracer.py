import json
from myshapes import Sphere, Triangle, Plane
import numpy as np
import matplotlib.pyplot as plt

scene_fn = "scene_custom.json"
res = 256

#### Scene Loader

def loadScene(scene_fn):

	with open(scene_fn) as f:
		data = json.load(f)

	spheres = []

	for sphere in data["Spheres"]:
		spheres.append(
			Sphere(sphere["Center"], sphere["Radius"], 
		 	sphere["Mdiff"], sphere["Mspec"], sphere["Mgls"], sphere["Refl"],
		 	sphere["Kd"], sphere["Ks"], sphere["Ka"]))
		
	triangles = []

	for triangle in data["Triangles"]:
		triangles.append(
			Triangle(triangle["A"], triangle["B"], triangle["C"],
			triangle["Mdiff"], triangle["Mspec"], triangle["Mgls"], triangle["Refl"],
			triangle["Kd"], triangle["Ks"], triangle["Ka"]))
	
	planes = []

	for plane in data["Planes"]:
		planes.append(
			Plane(plane["Normal"], plane["Distance"],
			plane["Mdiff"], plane["Mspec"], plane["Mgls"], plane["Refl"],
			plane["Kd"], plane["Ks"], plane["Ka"]))
	
	objects = spheres + triangles + planes

	camera = {
		"LookAt": np.array(data["Camera"]["LookAt"],),
		"LookFrom": np.array(data["Camera"]["LookFrom"]),
		"Up": np.array(data["Camera"]["Up"]),
		"FieldOfView": data["Camera"]["FieldOfView"]
	}

	light = {
		"DirectionToLight": np.array(data["Light"]["DirectionToLight"]),
		"LightColor": np.array(data["Light"]["LightColor"]),
		"AmbientLight": np.array(data["Light"]["AmbientLight"]),
		"BackgroundColor": np.array(data["Light"]["BackgroundColor"]),
	}

	return camera, light, objects

### Ray Tracer

camera, light, objects = loadScene(scene_fn)

image = np.zeros((res,res,3), dtype=np.float32)


# Orthogonalization
pFrom = camera["LookFrom"]
pAt = camera["LookAt"]
vUp = camera["Up"]
FOV = camera["FieldOfView"]

dVec = pAt - pFrom
d = np.linalg.norm(dVec)

e3 = dVec / d                             
e1 = np.cross(e3, vUp)
e1 = e1 / np.linalg.norm(e1)              
e2 = np.cross(e1, e3)
e2 = e2 / np.linalg.norm(e2)

# Window dimensions from FOV
uMax = d * np.tan(np.radians(FOV / 2.0))
vMax = uMax
uMin, vMin = -uMax, -vMax

# Pixel spacing
dU = (uMax - uMin) / (res + 1)
dV = (vMax - vMin) / (res + 1)


j = np.arange(res) - res // 2            
i = res // 2 - 1 - np.arange(res)

s = (pAt
     + dU * (j[np.newaxis, :, np.newaxis] + 0.5) * e1  
     + dV * (i[:, np.newaxis, np.newaxis] + 0.5) * e2)


rO = pFrom
rD = s - rO
rD = rD / np.linalg.norm(rD, axis=2, keepdims=True)


# cast rays and find intersection
def castRay(rayOrg, rayDir, objects):
    tMin = -1
    closest = None
    for obj in objects:
        t = obj.intersect(rayOrg, rayDir)
        if t > 0:
            if tMin < 0 or t < tMin:
                tMin = t
                closest = obj
    return tMin, closest

bgColor = light["BackgroundColor"]
l = light["DirectionToLight"] / np.linalg.norm(light["DirectionToLight"])

max_bounces = 4

def computeColor(ro, rayDir, bounces=0):
    t, obj = castRay(ro, rayDir, objects)

    if obj is None:
        return bgColor

    # intersection point
    p = ro + t * rayDir

    # surface normal at p
    if isinstance(obj, Sphere):
        n = obj.getNormal(p)
    else:
        n = obj.getNormal()
    n = n / np.linalg.norm(n)

    # view direction from p
    v = ro - p
    v = v / np.linalg.norm(v)

    # reflection of L
    NdotL = np.dot(n, l)
    r = 2.0 * NdotL * n - l
    r = r / np.linalg.norm(r)

    # color variables
    cDiff = light["LightColor"] * obj.diffuse  * max(NdotL, 0)
    cSpec = light["LightColor"] * obj.specular * max(np.dot(r, v), 0) ** obj.gloss
    cAmb  = light["AmbientLight"] * obj.diffuse

    # recurse up to max_bounces
    reflDir = rayDir - 2.0 * np.dot(rayDir, n) * n
    reflOrg = p + 1e-4 * n
    if bounces < max_bounces:
        cRefl = computeColor(reflOrg, reflDir, bounces + 1)
    else:
        cRefl = bgColor

    # cast from intersection point toward the light
    shadowOrg = p + 1e-4 * n
    _, shadowObj = castRay(shadowOrg, l, objects)
    if shadowObj is not None:
        return np.clip(obj.Ka * cAmb + obj.refl * cRefl, 0, 1)

    c = obj.Kd * cDiff + obj.Ks * cSpec + obj.Ka * cAmb + obj.refl * cRefl
    return np.clip(c, 0, 1)

for row in range(res):
    for col in range(res):
        image[row, col] = computeColor(rO, rD[row, col])


### Save and Display Output
plt.imsave("output.png", image)
plt.imshow(image);plt.show()

