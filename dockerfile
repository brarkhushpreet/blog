FROM node:20

WORKDIR /app

COPY package* .

ENV MONGO=mongodb+srv://khush_brar_05:1234@nodeexpressproject.g2tecgz.mongodb.net/Blog_Website?retryWrites=true&w=majority
ENV AUTH_SECRET=jkdfjkdnvljkdnfjda8934BH@db9db2ea45b9b1ad0848f99c3f9a31771388a568
ENV AUTH_URL=http://localhost:3000/api/auth
ENV AUTH_GITHUB_ID=f643bf9474172a71ad60
ENV AUTH_GITHUB_SECRET=db9db2ea45b9b1ad0848f99c3f9a31771388a568

RUN npm install
COPY . .


EXPOSE 3000

CMD ["npm", "run", "dev"]