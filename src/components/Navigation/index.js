// export default Navigation;
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { IoMdMenu } from "react-icons/io";

const Navigation = () => {
  return (
    <nav className="nav">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-sm-2 navpart1">
            <Button className="allcatTab">
              <span className="icon"><IoMdMenu /></span>
              <span className="text">All Categories</span>
            </Button>
          </div>

          <div className="col-sm-10 navpart2 d-flex align-items-center">
            <ul className="list list-inline ml-auto mb-0">
              <li className="list-inline-item">
                <Link to="/"><Button>Home</Button></Link>
              </li>
              <li className="list-inline-item">
                <Link to="/products"><Button>Products</Button></Link>
              </li>
              <li className="list-inline-item">
                <Link to="/"><Button>Contact</Button></Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;