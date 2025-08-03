import React from 'react'

const SigninPage = () => {
  return (
    <div>
        <h1>Signin Page</h1>
        <p>Please enter your credentials to sign in.</p>
        {/* Add your sign-in form here */}
        <form>
            <label>
                Email:
                <input type="email" name="email" required />
            </label>
            <br />
            <label>
                Password:
                <input type="password" name="password" required />
            </label>
            <br />
            <button type="submit">Sign In</button>
        </form>
        <p>Don't have an account? <a href="/signup">Sign up here</a>.</p>
        {/* Add any additional links or information here */}
      
    </div>
  )
}

export default SigninPage
