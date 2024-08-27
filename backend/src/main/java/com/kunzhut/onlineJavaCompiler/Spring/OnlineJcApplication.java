package com.kunzhut.onlineJavaCompiler.Spring;

import com.kunzhut.tmpfs.Tmpfs;
import jakarta.annotation.PreDestroy;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class OnlineJcApplication {

	protected static final Tmpfs tmpfs;
	static {
        try {
            tmpfs = new Tmpfs("/","javaTmpfs","500m");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    public static void main(String[] args) throws Exception {
        tmpfs.createTmpfs();
      //  tmpfs.addAction((tmpfsRoot)->{
      //      try {
      //          File[] files = Objects.requireNonNull(tmpfsRoot.listFiles());
      //          for (File a : files) {
      //              if ((System.currentTimeMillis() - ((FileTime) Files.getAttribute(a.toPath(), "creationTime")).toMillis()) > 60000) {
      //                  a.delete();
      //              }
      //          }
      //      }catch (Exception a){
      //          throw new RuntimeException(a);
      //      }
      //  },60000);

		SpringApplication.run(OnlineJcApplication.class, args);
	}

	@PreDestroy
	public void onDestroy() throws Exception {
          tmpfs.removeTmpfs();
	}

}
