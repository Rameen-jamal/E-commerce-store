import React, { useState, useEffect, useRef } from 'react';
import { FaAngleDown } from "react-icons/fa6";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia",
  "Austria", "Bangladesh", "Belgium", "Brazil", "Canada",
  "Chile", "China", "Colombia", "Croatia", "Czech Republic",
  "Denmark", "Egypt", "Ethiopia", "Finland", "France",
  "Germany", "Ghana", "Greece", "Hungary", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Japan", "Jordan", "Kenya", "Kuwait",
  "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand",
  "Nigeria", "Norway", "Oman", "Pakistan", "Philippines",
  "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain",
  "Sri Lanka", "Sweden", "Switzerland", "Syria", "Thailand",
  "Tunisia", "Turkey", "UAE", "Uganda", "Ukraine",
  "United Kingdom", "United States", "Vietnam", "Yemen", "Zimbabwe"
];

const Countrydropdown = () => {
  const [selected, setSelected] = useState('Detecting...');
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [detecting, setDetecting] = useState(true);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data?.country_name) {
          setSelected(data.country_name);
        } else {
          setSelected('Pakistan');
        }
      } catch (err) {
        setSelected('Pakistan'); 
      } finally {
        setDetecting(false);
      }
    };

    detectCountry();
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = COUNTRIES.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (country) => {
    setSelected(country);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="countrydropdown-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        className="countrydropdown-btn"
        onClick={() => !detecting && setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: '1px solid #ddd',
          borderRadius: '6px',
          padding: '6px 12px',
          cursor: detecting ? 'wait' : 'pointer',
          minWidth: '140px',
          whiteSpace: 'nowrap'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <span style={{ fontSize: '10px', color: '#888' }}>Your Location</span>
          <span style={{ fontSize: '13px', fontWeight: '600' }}>
            {detecting ? '🌍 Detecting...' : selected}
          </span>
        </div>
        {!detecting && (
          <FaAngleDown
            style={{
              marginLeft: 'auto',
              transition: 'transform 0.2s',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        )}
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          zIndex: 9999,
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          width: '200px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '8px' }}>
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '6px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
          <ul style={{
            maxHeight: '200px',
            overflowY: 'auto',
            margin: 0,
            padding: 0,
            listStyle: 'none'
          }}>
            {filtered.length > 0 ? (
              filtered.map((country) => (
                <li
                  key={country}
                  onClick={() => handleSelect(country)}
                  style={{
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    backgroundColor: selected === country ? '#f0f4ff' : 'transparent',
                    fontWeight: selected === country ? '600' : '400',
                  }}
                  onMouseEnter={e => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={e => e.target.style.backgroundColor = selected === country ? '#f0f4ff' : 'transparent'}
                >
                  {country}
                </li>
              ))
            ) : (
              <li style={{ padding: '10px 14px', color: '#999', fontSize: '13px' }}>
                No country found
              </li>
            )}
          </ul>

        </div>
      )}
    </div>
  );
};

export default Countrydropdown;