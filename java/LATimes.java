import java.io.InputStreamReader;
import java.net.URL;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import java.util.stream.*;
import java.util.*;
import java.io.*;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.apache.commons.text.StringEscapeUtils;
    
/**
   Fetches all the Homicide reports from LATimes 
*/
public class LATimes {
    static class Location {
        String type;
        Double[] coordinates;
    }

    static class Details {
        @SerializedName("ag")
        String age;
        @SerializedName("g")
        String gender;
        @SerializedName("n")
        String name;
        @SerializedName("r")
        String race;
        @SerializedName("u")
        String url;
        @SerializedName("y")
        String year;
    }

    static class Instance {
        Location geometry;
        Details properties;
    }

    static class Geojson {
        List<Instance> features;
    }

    static class Records {
        Geojson geojson;
    }

    public static Records getRecords(String url_addr) {
        try {
            System.out.println("Getting response from: " + url_addr);
            URL url = new URL(url_addr);
            Gson gson = new Gson();
            Records r = gson.fromJson(new InputStreamReader(url.openStream()), Records.class);
            System.out.println("Got it!");
            return r;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static void main(String[] args) {
        final String SEP = ",";
        final String LATIMES_GEO_URL = "http://homicide.latimes.com/api/homicide/all/"; //http://homicide.latimes.com/api/homicide/last-12/";
        Records records = getRecords(LATIMES_GEO_URL);
        //write them to csv
        try {
            FileWriter fw = new FileWriter("data/georecords.csv");
            assert (records != null);
            List<Instance> g_records = records.geojson.features;
            List<Instance> loc_records = g_records.stream()
                    .filter(g_r -> {
                        Double[] c = g_r.geometry.coordinates;
                        return c[0] != null && c[1] != null;
                    })
                    .collect(Collectors.toList());

            System.out.println("Starting to write " + loc_records.size() + " records");
            fw.write(Stream.of("ID", "Lat", "Lng", "Name", "Year", "URL", "Text").collect(Collectors.joining(SEP)) + "\n");
            IntStream.range(0, loc_records.size())
                    .boxed()
                    .parallel()
                    .forEach(i -> {
                        Instance inst = loc_records.get(i);
                        Double[] c = inst.geometry.coordinates;
                        Details p = inst.properties;
                        String text = "";
                        try {
                            Document doc = Jsoup.connect("http://homicide.latimes.com" + p.url).get();
                            text = doc.select("section.body").text();
                            fw.write(Stream.of(i + "", c[0] + "", c[1] + "", p.name, p.year, p.url,
                                    StringEscapeUtils.escapeCsv(text)).collect(Collectors.joining(SEP)) + "\n");
                        } catch (IOException e) {
                            System.err.println("Could not open link: " + p.url);
                        }
                    });
            fw.close();
            System.out.println("Done writing");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
