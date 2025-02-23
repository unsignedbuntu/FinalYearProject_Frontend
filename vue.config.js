// vue.config.js
module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'https://localhost:44358', // Backend adresiniz
          changeOrigin: true,
          secure: false, // Geliştirme sırasında sertifika doğrulamasını devre dışı bırakın
          pathRewrite: {
            '^/api': '' // /api ön ekini kaldırın
          }
        }
      }
    }
  };