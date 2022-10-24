// IMPORTS
// in node.js, we use require(), but in front-end javascript, can't use require; use import;
// for these raw js/html scripts (outside of a framework), we won't use yarn add node modules;
// we first manually copy-paste all of the ethers library to its own file, then import that
import {ethers} from "./ethers-5.6.esm.min.js"
import {contract_address, contract_abi} from "./constants.js"

// add buttons and their functionality (connect buttons to functions in this script)
const connect_button = document.getElementById("connect_button")
connect_button.onclick = connect
const fund_button = document.getElementById("fund_button")
fund_button.onclick = fund

// console.log(ethers)

// if there's not a window.ethereum, go ahead and set the connect button to say so
if (typeof window.ethereum == "undefined") {
	connect_button.innerHTML = "! Please install Metamask !";
}

// made async so that metamask won't constantly ask to connect
async function connect() {
	if (typeof window.ethereum !== "undefined") {
		console.log("CONNECT - found window.ethereum");
		try {
			// attempt to connect; open dialog for user to connect an account
			// once connected, the website can now make api calls to metamask,
			// though transactions will still require approval;
			// connected sites can: see address, balance, activity, and suggest txs to approve
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			console.log(`CONNECT - connected wallet accounts:\n${accounts}`)
			// then we can update the button to show it's connected
			connect_button.innerHTML = "* CONNECTED *"
		} 
        catch (error) {console.log(error)}
	} 
    else {
		console.log("!! CONNECT ERROR - window.ethereum not found")
		connect_button.innerHTML = "! Please install Metamask !"
	}
}

async function fund(eth_amount) {
	console.log(`FUND - now funding with ${eth_amount} ..`)
    if (typeof window.ethereum !== "undefined") {
        // need a provider or connection to the blockchain`
        // web3provider: takes the http endpoint and auto sets it in ethers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // need a signer/wallet/someone with gas
        // this will return whichever wallet/account is connected to the provider/metamask
        const signer = provider.getSigner()
        console.log("FUND - showing signer:")
        console.log(signer)
        // need a contract we're interacting with (need ABI + address)
        // often a contract will reference a constants file to check the right info/abi/etc
        const contract = new ethers.Contract(contract_address, contract_abi, signer)
        // now we can start making transactions
        const tx_response = await contract.fund({value: ethers.utils.parseEther(eth_amount)})
    }
} 

async function withdraw() {

}
