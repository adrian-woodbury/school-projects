package Project2;
import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.FileOutputStream;

public class SplitFiles {

	public static void main(String[] args) {

		Scanner inStream = null;

		try {
			inStream = new Scanner(new File("cran-1-1.all.1400"));
		}
		catch(FileNotFoundException e){
			System.err.println("Input file not found");
			System.exit(0);
		}

		String aLine = "";
		if(inStream.hasNextLine()) {
			aLine = inStream.nextLine().trim();
		}

		new File("Docs").mkdirs();
		PrintWriter outStream = null;

		while(inStream.hasNextLine()) {
			aLine = inStream.nextLine().trim();
			String[] items = aLine.split(" ");

			if(items[0].equals(".I")) {
				int docId = Integer.parseInt(items[1]);

				try {
					outStream = new PrintWriter(new FileOutputStream("Docs/" + docId + ".txt"));
				} catch(FileNotFoundException e) {
					System.err.println("File: " + docId + " Cannot Open");
					System.exit(0);
				}

				while(inStream.hasNextLine()) {
					aLine = inStream.nextLine().trim();
					if(aLine.equals(".W")) {
						break;
					}
				}

				while(inStream.hasNextLine()) {
					aLine = inStream.nextLine().trim();
					if(aLine.length() < 2 || !(aLine.charAt(0) == '.' && aLine.charAt(1) == 'I')) {
						outStream.print(aLine + " ");
					}
					else {
						outStream.close();
						break;
					}
				}
			}
		}

		if(outStream != null) outStream.close();
		inStream.close();
		System.out.println("Done splitting files.");
	}
}