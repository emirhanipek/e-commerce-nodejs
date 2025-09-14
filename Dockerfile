# Node.js resmi imajını kullan
FROM node:18

# Uygulama klasörünü oluştur
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Uygulama kodlarını kopyala
COPY . .

# Backend 3000 portunda çalışacak
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "run", "dev"]   # eğer nodemon ile çalışıyorsan
# CMD ["npm", "start"]      # production için
