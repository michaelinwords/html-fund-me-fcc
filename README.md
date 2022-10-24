# HTML Fund Me - Free Code Camp Tutorial

## General notes:

-   When building dapps, will usually make two repositories: one for the smart contracts (backend) and one for the front end/website (html, js, etc)
-   In order for our browser to know that we have Metamask or Phantom, those extensions automatically add components like window.ethereum and window.solana, which we can view in the console (inspect from browser)
    -   These extensions have a node automatically built into them, which we need in order to interact with the blockchain; if we look in Metamask, for example, we can see an RPC url for each network (which MM easily passes to the browser)
    -   window.ethereum is the provider

## HTML notes:

-   For this project, we will use HTML and Javascript, though later on, we will use Nextjs and React (a more modern stack) to build our websites
-   We start with an index.html file, type ! and click on the first option to auto populate our default code
-   We are installing the extension "Live Server"; can click "Go Live" in bottom left of vscode or command palette search "open with live server" to open up a browser with our html on the loopback/localhost endpoint (127.0.0.1) - this allows us to see our code live, with live updating (it will update upon save here)
-   Connecting to Metamask: check for window.ethereum with code such as `if (typeof window.ethereum !== "undefined")`; run eth_requestAccounts method (deprecated version: ethereum.enable())
-   Writing JS in HTML: use `<script>console.log("Example.")</script>` element
