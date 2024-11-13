import './src/input.css'
document.querySelector('#app').innerHTML = `
<div class="bg-red-500 p-4 text-3xl">Checkout</div>
    
    <div class="flex justify-center space-x-8">
        <div><h1 class="text-4xl text-white">The Wrench</h1></div>
    </div>

    <div class="flex justify-center space-x-8"><img src="/wrench.png" class="w-32"></div>
    
    <form id="custInfo">
    <div class="flex justify-center space-x-8">
      <div><br><label class="text-white" for="custFName">First Name:</label><br></div>
      <div><br><input type="text" id="custFName" maxlength="30" placeholder="John" required><br><br></div>
    </div>  

      <div class="flex justify-center space-x-8">
        <div><label class="text-white" for="custLName">Last Name:</label><br></div>
        <div><input type="text" id="custLName" placeholder="Lehuta" required><br><br></div>
      </div>

      <div class="flex justify-center space-x-1">
        <div><label class="text-white" for="streetAddr">Street Address:</label><br></div>
        <div><input type="text" id="streetAddr" placeholder="308 Negra Arroyo Lane" required><br></div>
      </div>

      <div class="flex justify-center space-x-8">
        <div><label class="text-white" for="cityAddr></label><br></div>
        <div><input type="text" id="cityAddr" placeholder="Albuquerque" required><br></div>
      </div>
      
      <div class="flex justify-center space-x-12">
        <div> <label class="text-white" for="states">Select a state:</label><br></div>
        <select id="states" name="states">
            <option value="">-- Select a state --</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
        </select>
        </div>
    </form>

    <div class="flex justify-center space-x-8">
    <form id="cardform">
      <div><br><br><label class="text-white" for="cardNumber">Card Number:</label><br></div>
      <div><input type="text" id="cardNumber" maxlength="16" placeholder="1234 5678 9012 3456" required><br></div>
      
      <div><label class="text-white" for="expiryDate">Expiration Date:</label><br></div>
      <div><input type="text" id="expiriationDate" maxlength="4" placeholder="MM/YY" required><br></div>
      
      <div><label class="text-white" for="securtyCode">Security Code:</label><br></div>
      <div><input type="text" id="securityCode" maxlength="3" placeholder="123" required><br><br></div>
      
      <div><button class="button button--action" type="button" onclick="validateForm()">Confirm Payment</button></div>
    </form>
    </div>

    <script>
      function validateForm()
      {
          const cardNumber = document.getElementById("cardNumber").value;
          const expiryDate = document.getElementById("expiryDate").value;
          const cvv = document.getElementById("cvv").value;
          
          // Basic validation example (for educational purposes)
          if (!cardNumber || cardNumber.length !== 16 || isNaN(cardNumber))
          {
            alert("Please enter a valid 16-digit card number.");
            return;
          }
          if (!expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate))
          {
            alert("Please enter a valid expiration date (MM/YY).");
            return;
          }
          if (!cvv || cvv.length !== 3 || isNaN(cvv))
          {
            alert("Please enter a valid 3-digit CVV.");
            return;
          }
          
          alert("Order placed, thanks for shopping at The Wrench!");
        }
    </script>

`
