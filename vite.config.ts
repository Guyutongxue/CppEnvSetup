import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeKaTeX from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { all } from "lowlight";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/CppEnvSetup/",
  plugins: [
    {
      ...mdx({
        remarkPlugins: [remarkGfm, remarkMath, remarkFrontmatter],
        rehypePlugins: [rehypeKaTeX, [rehypeHighlight, { languages: all }]],
      }),
      enforce: "pre",
    },
    react(),
  ],
});
