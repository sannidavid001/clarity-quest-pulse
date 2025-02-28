import {
    Clarinet,
    Tx,
    Chain,
    Account,
    types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Test quest creation",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        let block = chain.mineBlock([
            Tx.contractCall('quest-pulse', 'create-quest', 
                [types.ascii("Get in shape"), types.uint(30), types.uint(100)], 
                deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectUint(1);
        
        const response = chain.callReadOnlyFn('quest-pulse', 'get-quest-details', 
            [types.uint(1)], deployer.address);
        response.result.expectOk().expectSome();
    }
});

Clarinet.test({
    name: "Test quest completion",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        // Create quest
        let block = chain.mineBlock([
            Tx.contractCall('quest-pulse', 'create-quest',
                [types.ascii("Get in shape"), types.uint(30), types.uint(100)],
                deployer.address)
        ]);
        
        // Complete quest
        block = chain.mineBlock([
            Tx.contractCall('quest-pulse', 'complete-quest',
                [types.uint(1)],
                user1.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectBool(true);
        
        // Verify completion
        const response = chain.callReadOnlyFn('quest-pulse', 'get-completion-status',
            [types.uint(1), types.principal(user1.address)],
            deployer.address);
        response.result.expectOk().expectSome();
    }
});

Clarinet.test({
    name: "Test reward claiming",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const user1 = accounts.get('wallet_1')!;
        
        // Create and complete quest
        let block = chain.mineBlock([
            Tx.contractCall('quest-pulse', 'create-quest',
                [types.ascii("Get in shape"), types.uint(30), types.uint(100)],
                deployer.address),
            Tx.contractCall('quest-pulse', 'complete-quest',
                [types.uint(1)],
                user1.address)
        ]);
        
        // Claim reward
        block = chain.mineBlock([
            Tx.contractCall('quest-pulse', 'claim-reward',
                [types.uint(1)],
                user1.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectBool(true);
    }
});
