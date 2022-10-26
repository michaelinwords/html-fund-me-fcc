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
const balance_button = document.getElementById("balance_button")
balance_button.onclick = get_balance
const withdraw_button = document.getElementById("withdraw_button")
withdraw_button.onclick = withdraw

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

// previously this was: async function fund(eth_amount), but we removed eth_amount from parameters since
// we're not yet passing a value when we click the fund button; we'll just hard-code it for now
async function fund() {
	const eth_amount = document.getElementById("eth_input").value
	console.log(`FUND - now funding with ${eth_amount} eth ..`)
    if (typeof window.ethereum !== "undefined") {
        // need a provider or connection to the blockchain`
        // web3provider: takes the http endpoint and auto sets it in ethers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
		console.log("FUND - showing provider:")
        console.log(provider)
        // need a signer/wallet/someone with gas
        // this will return whichever wallet/account is connected to the provider/metamask;
		// if connected with account 1, signer is account 1; if connected with account 2, signer is account 2 .. etc
        const signer = provider.getSigner()
        console.log("FUND - showing signer:")
        console.log(signer)
        // need a contract we're interacting with (need ABI + address)
        // often a contract will reference a constants file to check the right info/abi/etc
        const contract = new ethers.Contract(contract_address, contract_abi, signer)
		try {
			const tx_response = await contract.fund({value: ethers.utils.parseEther(eth_amount)})
			// now we can start making transactions
			// listen for tx to be mined (or an event to finish) -- wait until complete
			await listen_for_tx_mine(tx_response, provider)
			console.log("COMPLETED listening for tx mine")
		}

		catch (error) {
			
			console.log(error)
		}
    }
} 

async function withdraw() {
	if (typeof window.ethereum != "undefined") {
		console.log("WITHDRAW - initiating withdrawal ..")
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const balance = await provider.getBalance(contract_address)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(contract_address, contract_abi, signer)
		try {
			const tx_response = await contract.withdraw()
			await listen_for_tx_mine(tx_response, provider)
		}
		catch (error) {console.log(error)}
	}
}

// this is not async because: 
function listen_for_tx_mine(n_tx_response, n_provider) {
	console.log(`Mining ${n_tx_response.hash}..`)
	// return new Promise()
	// need to create a listener for the blockchain, to define what the await will look for
	// want to listen for the event to happen
	// we'll use ethers: provider.once(transaction receipt as event, listener)
	// default anonymous function: () => {}
	// once provider.once sees the tx response, it's going to pass the tx receipt into the anon function
	// previously (outside of a promise), this provider.once did not actually wait for to totally complete; it just got added
	// to an event loop, allowing other code to continue, later returning to check if this code is completed, so we need to use promises
	// we resolve when the code completes properly; we might define reject as happening after some timeout
	return new Promise((resolve, reject) => {
		n_provider.once(n_tx_response.hash, (tx_receipt) => {
			console.log(`Completed with ${tx_receipt.confirmations} confirmations`)
			// resolve the promise
			resolve()
		})
	})	
}

async function get_balance() {
	if (typeof window.ethereum != "undefined") {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const balance = await provider.getBalance(contract_address)
		// use ethers.utils.formatEther to make the ether number easier to read
		console.log(`GET BALANCE - balance is: ${ethers.utils.formatEther(balance)}`)
	}
}
