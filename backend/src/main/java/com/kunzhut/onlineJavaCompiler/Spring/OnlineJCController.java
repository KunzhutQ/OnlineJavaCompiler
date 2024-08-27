package com.kunzhut.onlineJavaCompiler.Spring;

import com.kunzhut.onlineJavaCompiler.Compiler.JavaFileObjectFromString;
import com.kunzhut.onlineJavaCompiler.Spring.Logger.LoggingController;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.tools.JavaCompiler;
import javax.tools.StandardJavaFileManager;
import javax.tools.StandardLocation;
import javax.tools.ToolProvider;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Controller
public class OnlineJCController {
    Logger logger = LoggerFactory.getLogger(LoggingController.class);
    private final String JavaHome =System.getProperty("java.home")+File.separator+"bin"+File.separator+"java";
    private final File RootFolder = OnlineJcApplication.tmpfs.getRootFolder();
    private final JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();



        @GetMapping(value = "JavaCompiler/CodeEditor")
        public String getCodeEditor() {

                return "CodeEditor";
        }

        @CrossOrigin
        @PostMapping(value = "JavaCompiler/CodeEditor")
        public ResponseEntity<String> processCompileWithResult(HttpEntity<String> entity) {

            ResponseEntity<String> response = new ResponseEntity<>(HttpStatusCode.valueOf(400));

            if(entity!=null){
                logger.info("Header:\n" + entity.getHeaders() + "\nBody:\n" + entity.getBody());

                StandardJavaFileManager manager = compiler.getStandardFileManager(null,null, StandardCharsets.UTF_8);
                File rFolder = createAndGetRandomFolder();
                try {
                    manager.setLocation(StandardLocation.CLASS_OUTPUT, Collections.singletonList(rFolder));

                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                    OutputStreamWriter osw = new OutputStreamWriter(baos);

                    compiler.getTask(osw, manager, null, null, null, Collections.singletonList(new JavaFileObjectFromString(
                            "Main", new JSONObject(entity.getBody()).getString("sourceCode")
                    ))).call();
                    osw.close();

                    ProcessBuilder pb = new ProcessBuilder(JavaHome, "Main").directory(rFolder);
                    Process p = pb.start();
                    p.waitFor(1500, TimeUnit.MILLISECONDS);
                    if (p.isAlive()) p.destroy();

                    response = new ResponseEntity<>(new JSONObject().put("result", baos.size() != 0 ? baos.toString() : p.getErrorStream().available() == 0 ?
                            (new String(p.getInputStream().readAllBytes()) + "\n\t---Code executed successfully.---") : new String(p.getErrorStream().readAllBytes())).toString(),
                            HttpStatusCode.valueOf(200));

                    FileUtils.deleteDirectory(rFolder);
                }catch (Exception a){
                    response = new ResponseEntity<>(new JSONObject().put("result", "Code affecting server performance was detected, execution was forcibly stopped. Thread sleep? Infinite cycles? Many lines of code?").toString(),HttpStatusCode.valueOf(200));
                }
            }else{
                logger.warn("Bad Request, entity is null.");
            }

            return response;
        }

        private File createAndGetRandomFolder(){
          Random r = new Random();
          byte[] b = new byte[12];
          for(int a=0; a<b.length; a++){

            b[a]= (byte) (r.nextInt(26)+97);
          }
          File dir = new File(RootFolder.getPath() + File.separator + new String(b));

          return dir.mkdir()? dir : createAndGetRandomFolder();
       }

}
