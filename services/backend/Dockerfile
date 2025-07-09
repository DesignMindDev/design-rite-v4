FROM node:18-alpine AS base 
 
FROM base AS deps 
RUN apk add --no-cache libc6-compat curl 
WORKDIR /app 
COPY package*.json ./ 
RUN npm ci --only=production 
 
FROM base AS runner 
WORKDIR /app 
ENV NODE_ENV=production 
COPY --from=deps /app/node_modules ./node_modules 
COPY . . 
EXPOSE 8000 
CMD ["node", "server.js"] 
