export default defineConfig(({ mode }) => {
	// .envファイルを使うためのもの
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  // modeがproduction(本番環境)ならprocess.env.VITE_PRODUCTION_PATHを設定
  // modeがproductionでない(開発環境)ならルートパスを設定
  let basePath = (mode === "production" ? process.env.VITE_PRODUCTION_PATH : "./");

  return {
    base: basePath,
    plugins: [
      react(),
      env({ prefix: "VITE", mountedPath: "process.env" }),
    ]
  };
});