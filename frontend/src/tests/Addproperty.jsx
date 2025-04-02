import { useState } from 'react';

function AddProperty() {
    const [files, setFiles] = useState([]);
    const [form, setForm] = useState({
        amenities: "",
        type: "apartment",
        price: "",
        location: "",
        description: "",
    });

    const [token] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0MzM1MTE2NCwiZXhwIjoxNzQzNDM3NTY0fQ.alb0aZPX25F_YcNQJmpHLjmxeIR8X1pNRAuuL7hjoZs");


    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Convert amenities to JSON format
        form.amenities = JSON.stringify(form.amenities.split(",").map(item => item.trim()));

        Object.entries(form).forEach(([key, value]) => formData.append(key, value));
        Array.from(files).forEach((file) => formData.append("images", file));

        try {
            const res = await fetch("http://localhost:5000/api/properties", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await res.json();
            console.log("Response:", data);
        } catch (error) {
            console.error("Error uploading:", error);
        }
    };

    return (
        <div>
            <h2>Upload Property</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="amenities"
                    placeholder="Amenities (comma separated)"
                    onChange={handleChange}
                />
                <select name="type" onChange={handleChange}>
                    <option value="apartment">Apartment</option>
                    <option value="flat">Flat</option>
                    <option value="room">Room</option>
                    <option value="shutter">Shutter</option>
                </select>
                <input type="file" multiple onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}
export default AddProperty;
