"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";

const PostCard = ({ post, handleEdit, handleDelete, handleLike }) => {
	const { data: session } = useSession();
	const pathName = usePathname();
	const router = useRouter();

	const [copied, setCopied] = useState("");
	const [disabledLikes, setDisabledLikes] = useLocalStorage(
		"disabledLikes",
		{}
	);

	const handleProfileClick = () => {
		if (post.anon) return;
		if (post.creator._id === session?.user.id) return router.push("/profile");

		router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
	};

	const handleCopy = () => {
		const contentToCopy = `${post.post}\n\nBy ${
			post.anon ? "Anonymous" : post.creator?.username
		}`;
		setCopied(contentToCopy);
		navigator.clipboard.writeText(contentToCopy);
		setTimeout(() => setCopied(false), 3000);
	};

	const handleLocalLike = (postId) => {
		if (disabledLikes[postId]) return;
		setDisabledLikes((prevDisabledLikes) => ({
			...prevDisabledLikes,
			[postId]: true,
		}));
		postLike(postId);
	};

	const postLike = async (postId) => {
		await handleLike(postId);
	};

	const formatDate = (isoTimestamp) => {
		const dateObj = new Date(isoTimestamp);

		const hours = dateObj.getHours().toString().padStart(2, "0");
		const minutes = dateObj.getMinutes().toString().padStart(2, "0");
		const day = dateObj.getDate().toString().padStart(2, "0");
		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const month = monthNames[dateObj.getMonth()];
		const year = dateObj.getFullYear().toString().slice(-2);

		const formattedDate = `${hours}:${minutes} - ${day} ${month} ${year}`;
		return formattedDate;
	};

	const [isReadMore, setIsReadMore] = useState(true);

	const toggleReadMore = () => {
		setIsReadMore(!isReadMore);
	};

	return (
		<div className="post_card">
			<div className="flex justify-between items-start gap-5">
				<div
					className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
					onClick={handleProfileClick}
				>
					{post.anon ? (
						""
					) : (
						<Image
							src={post.creator?.image}
							alt="user_image"
							width={40}
							height={40}
							className="rounded-full object-contain"
						/>
					)}

					<div className="flex flex-col">
						<h3 className="font-satoshi text-sm font-semibold text-gray-300">
							{post.anon ? "Anonymous" : post.creator?.username}
						</h3>
						<p className="font-inter text-[0.65rem] text-gray-400">
							{post.anon 
								? "Senior" 
								: `${post.creator?.email.match(/f(\d{4})/)?.[1]} Batch • ${
									post.creator?.email
										.match(/@([^.]+)/)?.[1]
										?.charAt(0)
										?.toUpperCase()
									+ post.creator?.email.match(/@([^.]+)/)?.[1]?.slice(1)
									|| ''
								}`}
						</p>
					</div>
				</div>

				<div className="copy_btn" onClick={handleCopy}>
					{copied ===
					`${post.post}\n\nBy ${
						post.anon ? "Anonymous" : post.creator?.username
					}` ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							dataslot="icon"
							className="w-4 h-4 text-gray-300"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							dataslot="icon"
							className="w-4 h-4 text-gray-300"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
							/>
						</svg>
					)}
				</div>
			</div>
			<div>
				<p className="my-4 font-satoshi text-sm text-gray-200 whitespace-pre-wrap">
					{isReadMore ? post.post.slice(0, 600) : post.post}
					{isReadMore && post.post.length > 600 ? <span>...</span> : ""}
				</p>
				{post.post.length > 600 && (
					<>
						<button
							onClick={toggleReadMore}
							className="text-blue-300 text-sm hover:text-blue-400 transition duration-300"
						>
							{isReadMore ? "Read More" : "Read Less"}
						</button>
					</>
				)}
			</div>
			<div className="flex justify-between items-center my-4 text-xs text-gray-400">
				<p>{formatDate(post?.createdAt)}</p>

				{session?.user.id === post.creator?._id &&
				pathName === "/profile" ? null : (
					<span
						onClick={() => handleLocalLike(post._id)}
						className={`flex ${
							disabledLikes[post._id] ? "cursor-not-allowed" : "cursor-pointer"
						}`}
					>
						{disabledLikes[post._id] ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								dataslot="icon"
								className="w-4 h-4"
							>
								<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								dataslot="icon"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
								/>
							</svg>
						)}
						&nbsp; {post?.likes}
					</span>
				)}
			</div>

			{session?.user.id === post.creator?._id && pathName === "/profile" && (
				<div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
					<button className="cursor-pointer" onClick={handleEdit}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							dataslot="icon"
							className="w-5 h-5 text-gray-100 mx-10"
						>
							<path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
							<path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
						</svg>
					</button>

					<button className="cursor-pointer" onClick={handleDelete}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							dataslot="icon"
							className="w-5 h-5 text-gray-100 mx-10"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
							/>
						</svg>
					</button>
				</div>
			)}
		</div>
	);
};

export default PostCard;
