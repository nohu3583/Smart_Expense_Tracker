import React from 'react';
import './style.css'; // Import your CSS file

const Main = () => {
  return (
    <div className="wrapper">
      <header>
        <div className="logo">
          <a href="/" className="logo_link">Welcome USERNAME</a>
        </div>
      </header>
      <main className="main meny">
        <div className="title">Add expense</div>
        <section className="addexpense">
          <input type="number" min="0" placeholder="Amount" />
          <select>
            <option>Food</option>
            <option>Housing</option>
            <option>Transportation</option>
            <option>Health and wellness</option>
            <option>Shopping</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>
          <input type="date" />
          <input type="text" placeholder="Description" className="full-width" />
          <button id="submit">Add Expense</button>
        </section>
        <div className="expense_history">
          <ul>
            <table>
              <h1 className="opt opt_link">Expense History</h1>
            </table>
          </ul>
        </div>
        <div className="opt mini_meny">
          <a href="/" className="opt_link">Back</a>
        </div>
        <div className="pi_chart">
          <h1 className="opt opt_link">Pi-chart</h1>
        </div>
      </main>
    </div>
  );
};

export default Main;