import React from "react";
import { followUser, unfollowUser } from "./apiUser";

interface FollowProfileButtonProps {
    following: boolean;
    onButtonClick: (followFunction: Function) => void;
}

const FollowProfileButton: React.FC<FollowProfileButtonProps> = ({ following, onButtonClick }) => {
    const followClick = () => {
        onButtonClick(followUser);
    };

    const unfollowClick = () => {
        onButtonClick(unfollowUser);
    };

    return (
        <div className="">
            {!following ? (
                <button
                    onClick={followClick}
                    className="btn btn-success w-100"
                >
                    Follow
                </button>
            ) : (
                <button
                    onClick={unfollowClick}
                    className="btn btn-outline-danger w-100"
                >
                    UnFollow
                </button>
            )}
        </div>
    );
};

export default FollowProfileButton;
