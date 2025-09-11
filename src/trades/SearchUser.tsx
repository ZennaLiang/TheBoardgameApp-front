
import React from "react";
import Button from "react-bootstrap/Button";

interface SearchUserProps {
  searchValue: string;
  onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchUser: React.FC<SearchUserProps> = ({ searchValue, onChangeValue }) => {
  return (
    <div>
      <input 
        id='searchbar' 
        className='w-25 mt-2 rounded' 
        type='text' 
        name='search' 
        placeholder='Search...' 
        value={searchValue} 
        onChange={onChangeValue}
      />
      <Button variant="primary" id="userInput">Search</Button>
    </div>
  );
};

export default SearchUser;