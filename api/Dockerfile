FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Cliente de Prisma
RUN npx prisma generate
EXPOSE 4000
EXPOSE 1085
CMD ["npm", "run", "start"]