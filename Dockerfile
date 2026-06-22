FROM node:20-alpine

WORKDIR /app

COPY server ./server

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

EXPOSE 3001

CMD ["node", "server/index.mjs"]
