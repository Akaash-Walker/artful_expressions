import path from "path"

export default async () => {
  const [{ default: react }, { default: tailwindcss }] = await Promise.all([
    import("@vitejs/plugin-react"),
    import("@tailwindcss/vite"),
  ])

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
    },
  }
}
