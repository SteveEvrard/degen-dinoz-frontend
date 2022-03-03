import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { setAccount } from '../store/account/accountSlice';
import { useDispatch, useSelector } from 'react-redux';
import { DegenDinozContract, DegenDinozSignedContract, signer } from '../ethereum/ethers';
import { BigNumber } from 'ethers';

const MintButton = () => {

    const [amount, setAmount] = useState(1);
    const [supply, setSupply] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();
    const account = useSelector((state) => state.account.value);
    const getTotalMinted = async() => {
        const minted = await DegenDinozContract.totalSupply();
        const total = BigNumber.from(minted).toString();
        setSupply(total);
    } 

    useEffect(() => {
        getTotalMinted();
        listenForMint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleChange = (e) => {
        setAmount(e.target.value);
    }

    const connect = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account0 = accounts[0];
        dispatch(setAccount(account0));
    }

    const mint = async () => {
        const cost = supply < 2000 ? await DegenDinozContract.primaryCost() : await DegenDinozContract.secondaryCost();
        const total = BigNumber.from(cost).mul(amount);
        setLoading(true);
        setSuccess(false);
        DegenDinozSignedContract.mint(amount, {value: total})
            .then((resp) => {
                console.log(resp);
            })
            .catch(() => {
                setLoading(false);
            })
    }

    const listenForMint = async () => {
        const account = await signer.getAddress();
        DegenDinozContract.on(DegenDinozContract.filters.Transfer(null, account, null), () => {
            setLoading(false);
            setSuccess(true);
            getTotalMinted();
        })
    }

    const checkDisabled = () => {
        if(amount < 1) {
            return true;
        } else if(amount > 10 && supply < 1000) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div style={{display: 'inline'}}>
            <Typography sx={{marginBottom: '2vw', color: 'white', fontFamily: 'TroglodyteNF'}} variant='h3'>
                {supply}/5000 Minted
            </Typography>
            {success ? <Typography sx={{marginBottom: '2vw', color: 'white', fontFamily: 'TroglodyteNF'}} variant='h5'>Mint Complete!</Typography> : null}
            {loading ? null : <TextField disabled={!account} onChange={handleChange} defaultValue={1} type='number' label='Mint Quantity' sx={{width: '20vw', marginBottom: '2vw'}}/>}
            <div>
            {
                loading ?
                    <div style={{display: 'inline'}}>
                        <div style={{marginBottom: '2vw'}}><Typography sx={{marginBottom: '2vw', color: 'white', fontFamily: 'TroglodyteNF'}} variant='p'>Transaction being sent to blockchain, please allow up to 10 minutes to complete</Typography></div>
                        <div><CircularProgress size='15vw' color='primary'/></div>
                    </div>
                    :
                    account ? 
                        <Button disabled={checkDisabled()} onClick={mint} sx={{width: '20vw', height: '5vw', fontSize: '3vw', fontFamily: 'TroglodyteNF'}} color='primary' variant='contained' size='large'>Mint</Button>
                        :
                        <Button onClick={connect} sx={{width: '20vw', height: '5vw', fontSize: '3vw', fontFamily: 'TroglodyteNF'}} color='primary' variant='contained' size='large'>Connect</Button>
            }
            </div>
        </div>
    )

}

export default MintButton;