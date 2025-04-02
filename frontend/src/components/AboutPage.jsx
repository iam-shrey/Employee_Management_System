import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">About Employee Management System</h1>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 md:px-8">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700">
            The Employee Management System (EMS) is designed to simplify and
            streamline the management of employee-related tasks. From tracking
            attendance and generating offer letters to managing employee
            records, EMS offers a one-stop solution for all HR needs.
          </p>
        </section>
        <section className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Manage employee records efficiently</li>
            <li>Generate offer letters based on department and band levels</li>
            <li>Track attendance with daily updates</li>
            <li>Integrated email notifications for important updates</li>
            <li>Scalable architecture for future enhancements</li>
          </ul>
        </section>
        <section className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-700">
            Our vision is to provide an easy-to-use and efficient tool for
            managing employee workflows while reducing administrative overhead.
            We aim to empower businesses to focus on growth while we take care
            of the operational challenges.
          </p>
        </section>
        <section className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-700">
            For any inquiries or support, please contact us at:
          </p>
          <p className="text-blue-600 font-medium mt-2">
            support@ems-system.com
          </p>
        </section>
      </main>
      <footer className="bg-gray-800 text-white py-4 fixed">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Employee Management System. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;