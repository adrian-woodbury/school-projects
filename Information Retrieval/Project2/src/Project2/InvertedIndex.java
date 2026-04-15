package Project2;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Set;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.io.File;


public class InvertedIndex {
	class TermDf
	{
		String term;
		double df;
	}
	
	class DocIDTf
	{
		int docID;
		double tf;
	}
	
	//data
	private HashMap<TermDf, ArrayList<DocIDTf>> invertedIndex;
	private int N;
	private int currentDocID;
	
	public InvertedIndex()
	{
		invertedIndex = new HashMap<>();
		N = 0;
		currentDocID = -1;
	}
	
	// build Inverted Index
	// every term,DocID pair
	public void insert(String term, int DocID)
	{
		// get total number of docs
		if(currentDocID != DocID)
		{
			N++;
			currentDocID = DocID;
		}
		
		// does term exist in dict
		TermDf temp = termExist(term);
		if(temp == null) // term doesn't exist yet
		{
			// create the key
			TermDf key = new TermDf();
			key.term = term;
			key.df = 1;
			
			// create linked list
			ArrayList<DocIDTf> value = new ArrayList<>();
			//create node for docID and add to array
			DocIDTf node = new DocIDTf();
			node.docID = DocID;
			node.tf = 1;
			value.add(node);
			
			//add <key, value> to the hash map
			invertedIndex.put(key, value);
			
		}
		//term exists in dictionary, we need to update the linked list
		//if the docID is new, then add a new node to the arrayList
		//otherwise, update the tf by +1
		else 
		{
			if(updatePosting(invertedIndex.get(temp), DocID))
			{
				temp.df++;
			}
		}
	}
	
	private boolean updatePosting(ArrayList<DocIDTf> posting, int docID)
	{
		for(int i = 0; i < posting.size(); i++)
		{
			if(posting.get(i).docID == docID)
			{
				posting.get(i).tf += 1;
				return false;
			}
		}
		DocIDTf node = new DocIDTf();
		node.docID = docID;
		node.tf = 1;
		posting.add(node);
		return true;
	}
	
	private TermDf termExist(String term)
	{
		Set<TermDf> allTerms = invertedIndex.keySet();
		Iterator<TermDf> termIterator = allTerms.iterator();
		
		while(termIterator.hasNext())
		{
			TermDf temp = termIterator.next();
			if(temp.term.equals(term))
			{
				return temp;
			}
			
		}
		return null;
	}
	
	public void displayInvertedIndex()
	{
		Set<TermDf> allTerms = invertedIndex.keySet();
		Iterator<TermDf> termIterator = allTerms.iterator();
		while(termIterator.hasNext())
		{
			TermDf temp = termIterator.next();
			displayKey(temp);
			displayPosting(invertedIndex.get(temp));
			System.out.println();
		}
	}
	
	private void displayKey(TermDf t)
	{
		System.out.print("Term: " + t.term + " , DF: " + t.df + " -- ");
	}
	
	private void displayPosting(ArrayList<DocIDTf> posting)
	{
		for(int i = 0; i < posting.size(); i++)
		{
			System.out.print(" -> " +posting.get(i).docID + ",tf: " + posting.get(i).tf);
		}
	}
	
	public void updateInvertedIndex()
	{
		Set<TermDf> allTerms = invertedIndex.keySet();
		Iterator<TermDf> termIterator = allTerms.iterator();
		
		while(termIterator.hasNext())
		{
			TermDf temp = termIterator.next();
			temp.df = Math.log((double) N/temp.df);
			
			ArrayList<DocIDTf> list = invertedIndex.get(temp);
			for(int i = 0; i < list.size(); i++)
			{
				list.get(i).tf *= temp.df;
			}
		}
	}
	
	public HashMap<Integer, Double> processQuery(HashMap<String, Integer> query)
	{
		HashMap<Integer, Double> score = new HashMap<>();
		Set<TermDf> allTerms = invertedIndex.keySet();
		Iterator<TermDf> termIterator = allTerms.iterator();
		
		while(termIterator.hasNext())
		{
			TermDf temp = termIterator.next();
			if(query.containsKey(temp.term))
			{
				ArrayList<DocIDTf> list = invertedIndex.get(temp);
				for(int i = 0; i < list.size(); i++)
				{
					if(score.containsKey(list.get(i).docID))
					{
						double s = score.get(list.get(i).docID) + query.get(temp.term) * list.get(i).tf;
						score.remove(list.get(i).docID);
						score.put(list.get(i).docID, s);
					}
					else
					{
						double s = list.get(i).tf * query.get(temp.term);
						score.put(list.get(i).docID, s);
					}
				}
			}
		}
		
		return score;
	}
	
	public static void main(String[] args) throws Exception
	{
		InvertedIndex myIndex = new InvertedIndex();
		for(int i = 0; i < 1400; i++)
		{
			File f = new File("Docs/" + (i + 1) + ".txt");
			if(!f.exists()) continue;

			Scanner sc = new Scanner(f);
			StringBuilder content = new StringBuilder();
			while(sc.hasNextLine()) content.append(sc.nextLine()).append(" ");
			sc.close();

			String[] tokens = content.toString().toLowerCase().replaceAll("[^a-z0-9 ]", "").split("\\s+");
			for(String term : tokens)
				if(!term.isEmpty()) myIndex.insert(term, i + 1);
		}

		myIndex.updateInvertedIndex();

		// Parse queries from cran-1.qry
		ArrayList<String> queries = new ArrayList<>();
		Scanner qsc = new Scanner(new File("cran-1.qry"));
		StringBuilder current = new StringBuilder();
		boolean inW = false;
		while(qsc.hasNextLine())
		{
			String line = qsc.nextLine().trim();
			if(line.startsWith(".I"))
			{
				if(current.length() > 0) { queries.add(current.toString().trim()); current = new StringBuilder(); }
				inW = false;
			}
			else if(line.equals(".W")) inW = true;
			else if(inW) current.append(line).append(" ");
		}
		if(current.length() > 0) queries.add(current.toString().trim());
		qsc.close();

		// Parse cranqrel relevance
		HashMap<Integer, ArrayList<Integer>> relevance = new HashMap<>();
		Scanner rsc = new Scanner(new File("cranqrel-1"));
		while(rsc.hasNextLine())
		{
		    String line = rsc.nextLine().trim();
		    if(line.isEmpty()) continue;
		    String[] parts = line.split("\\s+");
		    if(parts.length < 3) continue;  // skip malformed lines
		    int queryID = Integer.parseInt(parts[0]);
		    int docID   = Integer.parseInt(parts[1]);
		    // handle both 3-column and 4-column formats
		    int level   = parts.length >= 4 ? Integer.parseInt(parts[3]) : Integer.parseInt(parts[2]);
		    if(level <= 3) relevance.computeIfAbsent(queryID, k -> new ArrayList<>()).add(docID);
		}
		rsc.close();

		// Run 20 queries, get top 10, calculate accuracy
		int totalQueries = Math.min(queries.size(), 20);
		int totalHits = 0;

		for(int qi = 0; qi < totalQueries; qi++)
		{
			String query = queries.get(qi);
			int queryID = qi + 1;

			HashMap<String, Integer> queryMap = new HashMap<>();
			String[] qTokens = query.toLowerCase().replaceAll("[^a-z0-9 ]", "").split("\\s+");
			for(String term : qTokens)
				queryMap.put(term, queryMap.getOrDefault(term, 0) + 1);

			HashMap<Integer, Double> scores = myIndex.processQuery(queryMap);

			List<Map.Entry<Integer, Double>> ranked = new ArrayList<>(scores.entrySet());
			ranked.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

			ArrayList<Integer> top10 = new ArrayList<>();
			for(int i = 0; i < Math.min(10, ranked.size()); i++)
				top10.add(ranked.get(i).getKey());

			ArrayList<Integer> relevant = relevance.getOrDefault(queryID, new ArrayList<>());
			int hits = 0;
			for(int docID : top10)
				if(relevant.contains(docID)) hits++;
			totalHits += hits;

			System.out.printf("Query %d: %d/10 relevant | Top 10: %s%n", queryID, hits, top10);
		}

		double accuracy = (double) totalHits / (totalQueries * 10) * 100;
		System.out.printf("%nOverall accuracy over queries: %.2f%%%n", accuracy);
	}
}
