import {Database, Model} from 'mongorito';
import test from 'ava';
import timestamps from '.';

test.beforeEach(t => {
	const db = new Database('localhost/mongorito_test');
	t.context.db = db;

	return db.connect();
});

test.afterEach(t => {
	return t.context.db.disconnect();
});

test('set timestamps', async t => {
	const {db} = t.context;

	class Post extends Model {}

	db.use(timestamps());
	db.register(Post);

	const post = new Post({title: 'Hello'});
	await post.save();

	const createdAt = post.get('created_at');
	const updatedAt = post.get('updated_at');

	t.true(createdAt instanceof Date);
	t.true(updatedAt instanceof Date);
	t.deepEqual(createdAt, updatedAt);

	post.set('title', 'World');
	await post.save();

	const latestCreatedAt = post.get('created_at');
	const latestUpdatedAt = post.get('updated_at');

	t.deepEqual(latestCreatedAt, createdAt);
	t.true(latestUpdatedAt > updatedAt);
});

test('custom field names', async t => {
	const {db} = t.context;

	class Post extends Model {}

	db.use(timestamps({
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	}));

	db.register(Post);

	const post = new Post({title: 'Hello'});
	await post.save();

	const createdAt = post.get('createdAt');
	const updatedAt = post.get('updatedAt');

	t.true(createdAt instanceof Date);
	t.true(updatedAt instanceof Date);
	t.deepEqual(createdAt, updatedAt);

	post.set('title', 'World');
	await post.save();

	const latestCreatedAt = post.get('createdAt');
	const latestUpdatedAt = post.get('updatedAt');

	t.deepEqual(latestCreatedAt, createdAt);
	t.true(latestUpdatedAt > updatedAt);
});

test('custom timestamp values', async t => {
	const {db} = t.context;

	class Post extends Model {}

	let i = 0;
	const getTimestamp = () => i++;

	db.use(timestamps({getTimestamp}));
	db.register(Post);

	const post = new Post({title: 'Hello'});
	await post.save();

	const createdAt = post.get('created_at');
	const updatedAt = post.get('updated_at');

	t.is(createdAt, 0);
	t.is(updatedAt, 0);

	post.set('title', 'World');
	await post.save();

	const latestCreatedAt = post.get('created_at');
	const latestUpdatedAt = post.get('updated_at');

	t.is(latestCreatedAt, 0);
	t.is(latestUpdatedAt, 1);
});

test('work with projection', async t => {
	const {db} = t.context;

	class Post extends Model {}

	let i = 0;
	const getTimestamp = () => i++;

	db.use(timestamps({getTimestamp}));
	db.register(Post);

	let post = new Post({title: 'Hello'});
	await post.save();

	const createdAt = post.get('created_at');
	const updatedAt = post.get('updated_at');

	t.is(createdAt, 0);
	t.is(updatedAt, 0);

	post = await Post.include(['title']).findOne({title: 'Hello'});
	post.set('content', 'Hello world');
	await post.save();
	post = await Post.findById(post.get('_id'))

	const latestCreatedAt = post.get('created_at');
	const latestUpdatedAt = post.get('updated_at');

	t.is(latestCreatedAt, 0);
	t.is(latestUpdatedAt, 1);
});
