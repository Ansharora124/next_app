
"use client";

import { useState } from "react";

const BookEvent = () => {
  
 
    const[email,setEmail]=useState("");
    const [submitted,setSubmitted]=useState(false);
const handleSubmit=(e:React.FormEvent)=>{
e,preventDefault();

setTimeout(()=>{
    setSubmitted(true);

},1000)

}
    return (
    <div id="bok-event">
     {submitted ? (
      <p className="text-sm">Thank you for signing up! We will keep you updated.</p>
     ):(
<form>
    <div> 
        <label htmlFor="email">Email Address</label>
        <input type="email"
         id="email" 
         value={email} 
         onChange={(e) => setEmail(e.target.value)}
         placeholder="Enter your email" />
    </div>
    <button type="submit" className="btn-submit">Submit</button>
</form>

     )}
    </div>
  )
}

export default BookEvent
