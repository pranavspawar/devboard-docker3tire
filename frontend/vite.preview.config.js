export default {
  preview: {
    proxy: {
      '/api': {
        target: 'http://backend:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};