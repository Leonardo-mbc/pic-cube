# pic-cube

## Setup [nvm](https://github.com/nvm-sh/nvm) and specify node version

```bash
nvm use
```

## For use on a local machine

```bash
yarn build
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend app.
If you want to change the startup port, change the `PORT` environment variable.

## For use on VMs

For VMs, the directory to be used must be mapped under /app/imports/ on the VM.
A Docker example is shown below.

```bash
docker build -t pic-cube .
docker run -p 3000:3000 -v /volumes/sample-dir:/app/impors/sample-dir pic-cube
```

## For development

### Architecture overview

![architecture](https://user-images.githubusercontent.com/6761278/188276760-af8a91f3-d9f1-4371-aa2e-648f896a1f6e.png)

### Getting started

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend app.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
