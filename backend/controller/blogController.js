const Joi = require('joi');
const fs = require('fs');
const Blog = require('../models/blog');
const { PATH } = require('../config/index');
const BlogDto = require('../dto/blog');
const Comment = require('../models/comment');

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const blogController = {
    async create(req, res, next) {
        // validate req body
        const createBlogSchema = Joi.object({
            title: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            content: Joi.string().required(),
            photo: Joi.string().required(),
        })

        const { error } = createBlogSchema.validate(req.body);
        if (error) {
            return next(error)
        }

        const { title, author, content, photo } = req.body;
        // handle photo storage and naming
        //read as buffer
        const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64')
        // allot a random name
        const imagePath = `${Date.now()}-${author}.png`;
        // save locally
        try {
            fs.writeFileSync(`storage/${imagePath}`, buffer)
        } catch (error) {
            return next(error);
        }
        // add to db
        let newBlog;
        try {
            newBlog = new Blog({
                title,
                content,
                author,
                photoPath: `${PATH}/storage/${imagePath}`
            });
            await newBlog.save();
        } catch (error) {
            return next(error);
        }
        // return reponse
        const blogDto = new BlogDto(newBlog)
        return res.status(201).json({ blog: blogDto });
    },
    async getAll(req, res, next) {
        try {
            const blogs = await Blog.find({});
            const blogDto = [];

            for (let i = 0; i < blogs.length; i++) {
                const dto = new BlogDto(blogs[i]);
                blogDto.push(dto);
            }

            return res.status(200).json({ blogs: blogDto })
        } catch (error) {
            return next(error);
        }
    },
    async getById(req, res, next) {
        //validate id
        const getByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        })

        const { error } = getByIdSchema.validate(req.params);
        if (error) {
            return next(error)
        }

        const { id } = req.params;

        let blog
        try {
            blog = await Blog.findOne({ _id: id });

        } catch (error) {
            return next(error);
        }

        // return response
        const blogDto = new BlogDto(blog);
        return res.status(200).json({ blog: blogDto })
    },
    async update(req, res, next) {
        // validate
        const updateBlogSchema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            blogId: Joi.string().regex(mongodbIdPattern).required(),
            photo: Joi.string()
        })

        const { error } = updateBlogSchema.validate(req.body);

        const { title, content, author, blogId, photo } = req.body;

        let blog;
        try {
            blog = await Blog.findOne({ _id: blogId });
        } catch (error) {
            return next(error);
        }

        if (photo) {
            let previousPhoto = blog.photoPath;

            previousPhoto = previousPhoto.split('/').at(-1);

            // delete photo
            fs.unlinkSync(`storage/${previousPhoto}`);

            const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64')
            // allot a random name
            const imagePath = `${Date.now()}-${author}.png`;
            // save locally
            try {
                fs.writeFileSync(`storage/${imagePath}`, buffer)
            } catch (error) {
                return next(error);
            }

            await Blog.updateOne({_id: blogId},
                {title, content, photoPath: `${PATH}/storage/${imagePath}`}
                );
        }
        else{
            await Blog.updateOne({_id: blogId}, {title, content})
        }
        //return reponse
        return res.status(200).json({message: "Blog updated Successfully"})
    },
    async delete(req, res, next) {
        // validate id
        const deleteBlogSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        })
        const {error} = deleteBlogSchema.validate(req.params);

        const {id} = req.params;
        // delete blog and comments
        try {
            await Blog.deleteOne({_id: id});

            await Comment.deleteMany({blog: id});
        } catch (error) {
            return next(error);
        }

        return res.status(200).json({message: "Blog Deleted!!"})
    }
}

module.exports = blogController;