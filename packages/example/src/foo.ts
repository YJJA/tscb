import { isBigInt } from "payload-is/bigint";

export function foo() {
  console.log("foo...");

  if (Math.random() > 0.5) {
    console.log("foo: random condition met");
    console.log("foo: isBigInt check:", isBigInt(123n));
  }
}
