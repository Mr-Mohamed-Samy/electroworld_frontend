import "../styles/SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    wilaya: ""
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/auth/signup", {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        phone: formData.phone,
        wilaya: formData.wilaya,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      toast.success("Account created successfully!");
      navigate("/homepage");
    } catch (err) {
      console.error(err);
      if (err.response) {
        toast.error(err.response.data.error || "Registration failed");
        console.error("Error details:", err.response.data);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unexpected error:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const wilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaïa", "Biskra", "Bechar", "Blida", "Bouira",
    "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Setif", "Saïda",
    "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
    "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
    "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naama", "Aïn Témouchent", "Ghardaïa", "Relizane",
    "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt",
    "Djanet", "El M'Ghair", "El Menia"
  ];

  return (
    <div className="main-container-signup">
      <h1>Welcome</h1>
      <p>Create an account</p>

      <form className="sign-up-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" className="details" value={formData.name} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" className="details" value={formData.phone} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="details" value={formData.email} onChange={handleChange} required />
        <select name="wilaya" className="details" value={formData.wilaya} onChange={handleChange} required>
          <option value="" disabled hidden>Select a Wilaya</option>
          {wilayas.map((wilaya, index) => (
            <option key={index} value={wilaya}>{wilaya}</option>
          ))}
        </select>

        <div className="password-wrapper">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="details"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="icon" onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="password-wrapper">
          <input
            type={passwordVisible ? "text" : "password"}
            name="passwordConfirm"
            placeholder="Confirm Password"
            className="details"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
        </div>

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="signup">
        <p>Already have an account?</p>
        <Link to="/Signin">Sign in</Link>
      </div>
    </div>
  );
}

export default Signup;
