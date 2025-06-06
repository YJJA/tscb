import { bar } from "./bar.ts";
import { foo } from "./foo.ts";

export default function example() {
  console.log("example...");
  foo();
  bar();
}

export { bar, foo };
