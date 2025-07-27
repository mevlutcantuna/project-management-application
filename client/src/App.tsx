import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="m-5 flex items-center gap-4">
      <Button onClick={() => setCount(0)}>Reset</Button>
      <Button
        onClick={() => {
          setCount((prev) => prev - 1);
        }}
      >
        Decrement
      </Button>

      <p>Count: {count}</p>
      <Button
        onClick={() => {
          setCount((prev) => prev + 1);
        }}
      >
        Increment
      </Button>
    </div>
  );
}

export default App;
