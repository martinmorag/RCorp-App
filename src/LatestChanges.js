import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LatestChanges.css';

const LatestChanges = () => {
  const [roles, setRoles] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cnaes, setCnaes] = useState([]);
  const [filters, setFilters] = useState({
    Role: '',
    Industry: '',
    Country: '',
    CNAE: ''
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get('https://rcorp-server.onrender.com/filter-options');
        setRoles(response.data.roles);
        setIndustries(response.data.industries);
        setCountries(response.data.countries);
        setCnaes(response.data.cnaes);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDownload = async () => {
    try {
      const response = await axios.post('https://rcorp-server.onrender.com/filter-and-download', filters, {
        responseType: 'blob' // Ensure the response is handled as a file
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'filtered_leads.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading filtered leads:', error);
    }
  };

  return (
    <div className='changes'>
      <h1 className='title'>Download your Leads</h1>
      <div className='filters'>
        <select className='select' name='Role' value={filters.Role} onChange={handleFilterChange}>
          <option value=''>Select Role</option>
          {roles.map((role, index) => (
            <option key={index} value={role}>{role}</option>
          ))}
        </select>
        <select className='select' name='Industry' value={filters.Industry} onChange={handleFilterChange}>
          <option value=''>Select Industry</option>
          {industries.map((industry, index) => (
            <option key={index} value={industry}>{industry}</option>
          ))}
        </select>
        <select className='select' name='Country' value={filters.Country} onChange={handleFilterChange}>
          <option value=''>Select Country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>
        <select className='select' name='CNAE' value={filters.CNAE} onChange={handleFilterChange}>
          <option value=''>Select CNAE</option>
          {cnaes.map((cnae, index) => (
            <option key={index} value={cnae}>{cnae}</option>
          ))}
        </select>
        <button className='button' onClick={handleDownload}>Download Filtered Leads</button>
      </div>
    </div>
  );
};

export default LatestChanges;