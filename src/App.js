import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-tabs/style/react-tabs.css";
import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
//import { ethers } from 'ethers';
import Web3 from "web3";
//import { parseEther, formatEther } from '@ethersproject/units';
import CharityChain from "./contracts/CharityChain.json";

const CharityChainContractAddress =
  "0xBf0FeB45d923440395Ed9F11787e9dBD2277b38E";
// const emptyAddress = '0x0000000000000000000000000000000000000000';

function App() {
  const [account, setAccount] = useState(0);
  const [orgName, setOrgName] = useState("");
  const [orgCoinsWanted, setOrgCoinsWanted] = useState("");
  const [show, setShow] = useState(true);
  const [totalProduct, setTotalProduct] = useState([]);
  const [charityChain, setCharityChain] = useState();
  const [orgsCount, setOrgsCount] = useState(0);
  const [totalOrganizations, setTotalOrganizations] = useState([]);
  const [balance, setBalance] = useState(0);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [web3, setWeb3] = useState("");
  const [bgClr, setBgClr] = useState("");
  const [clickedItems, setClickedItems] = useState([]);
  const [buttonStyles, setButtonStyles] = useState({});

  //Sets up a new Ethereum provider and returns an interface for interacting with the smart contract
  //  async function initializeProvider() {
  //   const provider = new ethers.BrowserProvider(window.ethereum);
  //   const signer = provider.getSigner();
  //   return new ethers.Contract(CharityChainContractAddress, CharityChain.abi, signer);
  // }

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    await loadBlockchainData();
  }

  async function loadBlockchainData() {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    setAccount(account);
    // const networkId = await web3.eth.net.getId();
    // console.log(networkId);
    const contract = await new web3.eth.Contract(
      CharityChain.abi,
      CharityChainContractAddress
    );
    setCharityChain(contract);
  }

  const handleContracts = async () => {
    const web3 = window.web3;
    const contract = await new web3.eth.Contract(
      CharityChain.abi,
      CharityChainContractAddress
    );
    console.log(contract);
    // setCharityChain(contract);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    setAccount(accounts);
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  // useEffect(() => {
  //   handleContracts()
  // }, [web3])

  // // Displays a prompt for the user to select which accounts to connect
  // async function requestAccount() {
  //   const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //   setAccount(account[0]);
  // }

  async function createProducts(e) {
    e.preventDefault();
    setOrgName(e.target.orgname.value);
    console.log(charityChain);
    console.log(e.target.coinswanted.value);
    try {
      const CoinsWanted = convertPriceToEther(e.target.coinswanted.value);
      setOrgCoinsWanted(parseInt(CoinsWanted));
      console.log(orgName, orgCoinsWanted);
      console.log(typeof orgCoinsWanted);
      await charityChain.methods
        .createOrganisation(orgName, orgCoinsWanted)
        .send({ from: account[0] })
        .on("receipt", (receipt) => {
          setTotalProduct([
            ...totalProduct,
            receipt.events.OrganisationCreated.returnValues,
          ]);
          console.log(receipt.events.OrganisationCreated.returnValues);
          console.log(totalProduct);
        });
      setOrgName("");
      setOrgCoinsWanted("");
    } catch (error) {
      console.log("That's an error");
      console.error(error);
    }
  }

  const purchaseProducts = async (id, coinsWanted) => {
    setShow(true);
    try {
      await charityChain.methods
        .giveDonation(id)
        .send({ from: account[1], value: coinsWanted })
        .on("receipt", (receipt) => {
          console.log(receipt.events.OrganisationDonated.returnValues);
          purchaseProducts(id, coinsWanted);
          setClickedItems((prevClickedItems) => [...prevClickedItems, id]);
          setButtonStyles((prevStyles) => ({
            ...prevStyles,
            [id]: { background: "White", color: "green" },
          }));
        });
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch the total organizations and update state
  const fetchOrganizations = async () => {
    try {
      const totalCount = await charityChain.methods.getCount();
      setOrgsCount(totalCount);

      const organizations = [];
      for (let i = 1; i <= totalCount; i++) {
        const orgDetails = await charityChain.methods.getOrganizationDetails(i);
        organizations.push({
          id: orgDetails[0],
          name: orgDetails[1],
          coinsWanted: orgDetails[2],
          reqSatisfied: orgDetails[4],
        });
      }
      setTotalOrganizations(organizations);
    } catch (error) {
      console.error(error);
    }
  };

  function convertPriceToEther(price) {
    return Web3.utils.toWei(price.toString(), "ether");
  }

  function convertEtherToPrice(price) {
    return Web3.utils.fromWei(price.toString(), "ether");
  }

  // const changeText = () => {
  //   setBtText("Donated");
  //   setBgClr("green");
  // };

  return (
    <div className="container-fluid p-0" style={{ background: "white" }}>
      <header className="navbar d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto mx-auto text-dark text-decoration-none"
        >
          <svg className="bi me-2" width="40" height="32">
            <use xlinkHref="#bootstrap"></use>
          </svg>
          <span className="material-symbols-outlined">volunteer_activism</span>
          <span className="fs-4 text-center logo-head">CHARITY DAPP</span>
        </a>
      </header>
      <div className="container-fluid bg-image py-5 text-center text-light">
        <h1 className="display-5 fw-bold">Trustable Charity</h1>
        <br />
        <p className="fs-4 text-center mx-auto px-5">
          Using Blockchain, we try to create a trustable charity app which has
          been lately exploited.
          <br />
          In the name of charity many high profile scandals have occured our aim
          is to create trust again in charities
        </p>
      </div>

      <div className="d-flex justify-content-center m-3">
        <button onClick={handleContracts} className="btn btn-primary ">
          Load Contract
        </button>
      </div>

      <Tabs>
        <TabList className="nav nav-underline nav-fill justify-content-center">
          <Tab className="nav-item nav-link" style={{ color: "black" }}>
            Add Organisation
          </Tab>
          <Tab className="nav-item nav-link" style={{ color: "black" }}>
            Organisations List
          </Tab>
        </TabList>

        <TabPanel className="nav justify-content-center">
          <div className="text-center">
            <div className="pt-5">
              <form
                onSubmit={(e) => createProducts(e)}
                className="example-form mx-auto"
                autoComplete="off"
              >
                <label>Organisation Name</label>
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="Enter your Organisation Name here"
                  name="orgname"
                />

                <label>Organisation coins wanted</label>
                <input
                  className="form-control mb-3"
                  type="number"
                  placeholder="Enter coins required for your Organisation here"
                  name="coinswanted"
                />

                <button
                  type="submit"
                  className="btn btn-primary btn-block example-full-width"
                >
                  Add Organisation
                </button>
                {/*onClick={() => createProducts(productName, productPrice)}*/}
              </form>
            </div>
          </div>
        </TabPanel>

        <TabPanel className="nav justify-content-center">
          <div className="mx-auto orglist">
            {/* <h1>{totalProduct}</h1> */}

            <p>{totalOrganizations}</p>
            {totalProduct.map((product, index) => (
              <div key={index}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1024px-Ethereum-icon-purple.svg.png"
                  alt="icon"
                />
                <span>
                  <h4 style={{ display: "inline", margin: "10px" }}>
                    {product.name}
                  </h4>
                  <p style={{ display: "inline", margin: "10px" }}>
                    ${convertEtherToPrice(product.coins_wanted)}
                  </p>
                </span>
                <span className="example-spacer"></span>

                {product.reqSatisfied ? (
                  <span style={{ color: "green" }}>Donated</span>
                ) : clickedItems.includes(product.id) ? (
                  <span className="donatedbutton" style={{ color: "green" }}>Donated</span>
                ) : (
                  <button
                    key={product.id}
                    style={{
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                    className="btn btn-primary btn-block donatedbutton"
                    onClick={() => {
                      purchaseProducts(product.id, product.coins_wanted);
                    }}
                  >
                    Donate
                  </button>
                )}

                <hr />
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default App;
