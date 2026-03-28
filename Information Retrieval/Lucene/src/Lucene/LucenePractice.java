package Lucene;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Date;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
//import org.apache.lucene.demo.knn.DemoEmbeddings;
//import org.apache.lucene.demo.knn.KnnVectorDict;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.KnnFloatVectorField;
import org.apache.lucene.document.LongField;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.IndexWriterConfig.OpenMode;
import org.apache.lucene.index.StoredFields;
import org.apache.lucene.index.Term;
import org.apache.lucene.index.VectorSimilarityFunction;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.IOUtils;


public class LucenePractice {

	public static void main(String[] args) {
		String s1 = "computer science is a greate major";
		String s2 = "Computer science Computer Engineering";
		String s3 = "today is Monday";
		
		String indexPath = "Index";
		try {
			Directory dir = FSDirectory.open(Paths.get(indexPath));
			Analyzer analyzer = new StandardAnalyzer();
			IndexWriterConfig iwc = new IndexWriterConfig(analyzer);
			
			iwc.setOpenMode(OpenMode.CREATE_OR_APPEND);
			
			IndexWriter writer = new IndexWriter(dir, iwc);
			
			Document doc1 = new Document();
			doc1.add(new Field("Contents", s1, TextField.TYPE_STORED));
			writer.addDocument(doc1);
			
			Document doc2 = new Document();
			doc2.add(new Field("Contents", s2, TextField.TYPE_STORED));
			writer.addDocument(doc2);
			
			Document doc3 = new Document();
			doc3.add(new Field("Contents", s3, TextField.TYPE_STORED));
			writer.addDocument(doc3);
			
			writer.close();
			
			DirectoryReader ireader = DirectoryReader.open(dir);
			
			IndexSearcher isearcher = new IndexSearcher(ireader);
			
			QueryParser parser = new QueryParser("Contents", analyzer);
			
			Query query = parser.parse("computer");
			
			ScoreDoc[] hits = isearcher.search(query, 10).scoreDocs;
			
			for(int i = 0; i < hits.length; i++)
			{
				System.out.println("doc = " + hits[i].doc + " score = " + hits[i].score); 
			}
			ireader.close();
			dir.close();
			
		}
		catch(Exception e)
		{
			System.out.println("Error....");
		}

	}

}
