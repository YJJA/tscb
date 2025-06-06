import { isBigInt } from "payload-is";

export function bar() {
  console.log("bar...");
  if (Math.random() > 0.5) {
    console.log("foo: random condition met");
    console.log("foo: isBigInt check:", isBigInt(123n));
  }
}
