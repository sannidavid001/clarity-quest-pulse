import {
    Clarinet,
    Tx,
    Chain,
    Account,
    types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test quest creation with valid reward",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('quest-pulse', 'create-quest', 
                [types.ascii("Get in shape"), types.uint(30), types.uint(100)], 
                deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectUint(1);
    }
});

Clarinet.test({
    name: "Test quest creation with invalid reward",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('quest-pulse', 'create-quest', 
                [types.ascii("Get in shape"), types.uint(30), types.uint(0)], 
                deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectErr(104);
    }
});

Clarinet.test({
    name: "Test creator cannot complete own quest",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('quest-pulse', 'create-quest',
                [types.ascii("Get in shape"), types.uint(30), types.uint(100)],
                deployer.address),
            Tx.contractCall('quest-pulse', 'complete-quest',
                [types.uint(1)],
                deployer.address)
        ]);
        
        block.receipts[1].result.expectErr(105);
    }
});

// Original tests remain unchanged...
