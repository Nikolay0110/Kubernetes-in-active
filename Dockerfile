FROM node:7
LABEL authors="nikolay"
ADD app.js /app.js
ENTRYPOINT ["node", "app.js"]
