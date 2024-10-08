package com.kunzhut.onlineJavaCompiler.Compiler;


import javax.tools.SimpleJavaFileObject;
import java.net.URI;

public class JavaFileObjectFromString extends SimpleJavaFileObject {
        private final String code;

        /**
         * Constructs a new JavaSourceFromString.
         * @param name the name of the compilation unit represented by this file object
         * @param code the source code for the compilation unit represented by this file object
         */
        public JavaFileObjectFromString(String name, String code) {
            super(URI.create("string:///" + name.replace('.','/') + Kind.SOURCE.extension),
                    Kind.SOURCE);
            this.code = code;
        }

        @Override
        public CharSequence getCharContent(boolean ignoreEncodingErrors) {
            return code;
        }

}
