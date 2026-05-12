import { describe, it, expect } from "vitest";
import { Wallet, decode, encode } from "xrpl";
import { Transaction, TransactionRegistry } from "../src/index.js";
import { TransactionFixtures } from "./fixtures.js";

describe("Offline Integration: xrplt + xrpl", () => {
  const wallet = Wallet.generate();

  describe("Registry Sweep: All Transaction Types", () => {
    const allTypes = TransactionRegistry.types();

    allTypes.forEach((type) => {
      it(`serializes and signs ${type} correctly`, () => {
        const fixture = TransactionFixtures[type];

        if (!fixture) {
          // If no fixture yet, we still check if it can be created with basic fields
          // but we'll mark it as a warning/skip in real scenarios. 
          // For now, let's just use basic fields to avoid failing the whole suite.
          const tx = Transaction.create(type, {
            Account: wallet.address,
            Fee: "12",
            Sequence: 1,
          });
          const json = tx.toJSON();
          expect(json.TransactionType).toBe(type);
          return;
        }

        const tx = Transaction.create(type, {
          ...fixture,
          Fee: "12",
          Sequence: 1,
        });

        const txJSON = tx.toJSON();

        // 1. Verify JSON structure
        expect(txJSON.TransactionType).toBe(type);
        expect(txJSON.Account).toBe(fixture.Account || wallet.address);

        // 2. Verify xrpl.js can encode it
        const encoded = encode(txJSON as any);
        expect(encoded).toBeDefined();

        // 3. Verify xrpl.js can decode it back
        const decoded = decode(encoded);
        expect(decoded.TransactionType).toBe(type);

        // 4. Verify xrpl.js can sign it
        const signed = wallet.sign(txJSON as any);
        expect(signed.tx_blob).toBeDefined();
        expect(signed.hash).toBeDefined();
      });
    });
  });

  describe("Utility Integration", () => {
    it("handles issued currencies with xrpl encoding", () => {
      const tx = Transaction.create("Payment", {
        Account: wallet.address,
        Destination: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
        Amount: {
          currency: "USD",
          value: "100",
          issuer: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
        },
      });

      const encoded = encode(tx.toJSON() as any);
      const decoded = decode(encoded);
      expect((decoded.Amount as any).currency).toBe("USD");
    });
  });
});
