import { ChangeEvent, useState } from 'react';
import { useCreatePostMutation } from '../__generated__/graphql';

interface CreatePostState {
	title: string;
	text: string;
	keywords: string;
}

const defaultCreatePost: CreatePostState = {
	title: '',
	text: '',
	keywords: ''
};

interface CreatePostProps {}

export const CreatePost: React.FC<CreatePostProps> = () => {
	const [createPost] = useCreatePostMutation();
	const [formData, setFormData] = useState<CreatePostState>({
		...defaultCreatePost
	});

	const handleFieldChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { errors } = await createPost({
			variables: { input: formData },
			update: cache => {
				// evict the posts query
				cache.evict({ fieldName: 'posts' });
			}
		});

		console.log(errors);
	};
	return (
		<form onSubmit={handleSubmit}>
			<div>
				<div>
					<label htmlFor="title">Title:</label>
				</div>
				<div>
					<input
						type="text"
						name="title"
						id="title"
						placeholder="Title"
						required
						value={formData.title}
						onChange={handleFieldChange}
					/>
				</div>
			</div>
			<div>
				<div>
					<label htmlFor="keywords">Keywords:</label>
				</div>
				<div>
					<input
						type="text"
						name="keywords"
						id="keywords"
						placeholder="Keywords"
						value={formData.keywords}
						onChange={handleFieldChange}
					/>
				</div>
			</div>
			<div>
				<div>
					<label htmlFor="text">Text:</label>
				</div>
				<div>
					<textarea
						name="text"
						id="text"
						placeholder="Text"
						required
						value={formData.text}
						onChange={handleFieldChange}
					/>
				</div>
			</div>
			<div>
				<button type="submit">Create post</button>
			</div>
		</form>
	);
};
