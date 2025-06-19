import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import algosdk from 'algosdk';

export default function TokenCreator() {
  const [name, setName] = useState('');
  const [unitName, setUnitName] = useState('');
  const [supply, setSupply] = useState('1000000');
  const [decimals, setDecimals] = useState('0');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [includeLogo, setIncludeLogo] = useState(false);
  const [lockSupply, setLockSupply] = useState(false);

  const FEE_ADDRESS = 'YOUR_ALGORAND_ADDRESS_HERE';

  const calculateFee = () => {
    let fee = 10_000_000; // base: 10 ALGO
    if (includeLogo) fee += 10_000_000;
    if (lockSupply) fee += 10_000_000;
    return fee;
  };

  const createToken = async () => {
    try {
      setStatus('🔗 Connecting to wallet...');

      const pera = new window.algorandWalletConnector.PeraWalletConnect();
      const accounts = await pera.connect();
      const sender = accounts[0];

      setStatus('🧾 Preparing transactions...');

      const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');
      const suggestedParams = await algodClient.getTransactionParams().do();

      const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: sender,
        to: FEE_ADDRESS,
        amount: calculateFee(),
        suggestedParams,
      });

      const assetTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: sender,
        assetName: name,
        unitName: unitName,
        total: parseInt(supply),
        decimals: parseInt(decimals),
        assetURL: includeLogo ? url : '',
        defaultFrozen: false,
        manager: lockSupply ? undefined : sender,
        reserve: sender,
        freeze: sender,
        clawback: sender,
        suggestedParams,
      });

      algosdk.assignGroupID([paymentTxn, assetTxn]);
      const txnGroup = [paymentTxn, assetTxn].map((txn) => ({ txn, signers: [sender] }));
      const signedTxns = await pera.signTransaction([txnGroup]);

      setStatus('📤 Sending to blockchain...');
      const { txId } = await algodClient.sendRawTransaction(signedTxns).do();

      setStatus('⏳ Waiting for confirmation...');
      await algosdk.waitForConfirmation(algodClient, txId, 4);

      setStatus(`✅ Token created! TXID: ${txId}`);
    } catch (err) {
      console.error(err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-center">Algorand Token Creator</h1>

      <Input placeholder="Token Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Symbol (Unit Name)" value={unitName} onChange={(e) => setUnitName(e.target.value)} />
      <Input placeholder="Total Supply" value={supply} onChange={(e) => setSupply(e.target.value)} />
      <Input placeholder="Decimals (e.g. 0, 6)" value={decimals} onChange={(e) => setDecimals(e.target.value)} />
      <Input placeholder="Logo URL (optional)" value={url} onChange={(e) => setUrl(e.target.value)} disabled={!includeLogo} />

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={includeLogo} onChange={(e) => setIncludeLogo(e.target.checked)} />
        <span>Add Logo (+10 ALGO)</span>
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={lockSupply} onChange={(e) => setLockSupply(e.target.checked)} />
        <span>Lock Supply (no further minting) (+10 ALGO)</span>
      </label>

      <Button onClick={createToken}>
        Create Token ({calculateFee() / 1_000_000} ALGO)
      </Button>

      <p className="text-center text-sm text-gray-700 whitespace-pre-line">{status}</p>
    </div>
  );
}
