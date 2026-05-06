const Submission = require('../models/submission');
const Assignment = require("../models/Assignment");
const Task = require('../models/task');
const ResObj = require('../utils/helper').ResObj;

const submitTask = async (req, res) => {
    try {
        const { taskId, githubLink } = req.body;
        const internId = req.user.id;

        console.log('Submit task request:', { taskId, githubLink, internId });

        // Check if task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json(ResObj(false, 'Task not found'));
        }

        // Check if submission already exists
        const existingSubmission = await Submission.findOne({
            taskId: taskId,
            internId: internId
        });

        if (existingSubmission) {
            existingSubmission.githubLink = githubLink;
            existingSubmission.status = 'pending'; // Reset status on resubmit
            existingSubmission.feedback = null;
            await existingSubmission.save();
            console.log('Submission updated:', existingSubmission);
            return res.status(200).json(ResObj(true, 'Submission updated successfully', existingSubmission));
        }

        // Create new submission
        const newSubmission = new Submission({
            taskId: taskId,
            internId: internId,
            githubLink: githubLink,
            status: 'pending'
        });

        await newSubmission.save();
        console.log('New submission created:', newSubmission);

        res.status(201).json(ResObj(true, 'Submission created successfully', newSubmission));
    } catch (error) {
        console.error('Submit task error:', error);
        res.status(500).json(ResObj(false, 'Server error: ' + error.message));
    }
}

const getMySubmissions = async (req, res) => {
    try {
        const internId = req.params.internId;
        console.log('Getting submissions for intern:', internId);

        const submissions = await Submission.find({ internId: internId })
            .populate('taskId', 'title description deadline field')
            .populate('internId', 'name email');

        console.log('Found submissions:', submissions.length);
        res.status(200).json(ResObj(true, 'Submissions retrieved successfully', submissions));
    } catch (error) {
        console.error(error);
        res.status(500).json(ResObj(false, 'Server error'));
    }
}

const getAllSubmissions = async (req, res) => {
    try {
        console.log('Fetching all submissions...');

        const submissions = await Submission.find()
            .populate('taskId', 'title description deadline field')
            .populate('internId', 'name email');

        console.log(`Found ${submissions.length} submissions`);

        // Log each submission for debugging
        submissions.forEach(sub => {
            console.log(`Submission: ${sub._id}, Task: ${sub.taskId?.title}, Intern: ${sub.internId?.name}, Status: ${sub.status}`);
        });

        res.status(200).json(ResObj(true, 'Submissions retrieved successfully', submissions));
    } catch (error) {
        console.error('Error fetching all submissions:', error);
        res.status(500).json(ResObj(false, 'Server error: ' + error.message));
    }
}

const reviewSubmission = async (req, res) => {
    try {
        const { status, feedback } = req.body;
        const { submissionId } = req.params;

        console.log('Reviewing submission:', { submissionId, status, feedback });

        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json(ResObj(false, "Submission not found"));
        }

        submission.status = status;
        submission.feedback = feedback;

        await submission.save();
        console.log('Submission updated:', submission);

        // AUTO UPDATE ASSIGNMENT when approved
        if (status === "approved") {
            const updatedAssignment = await Assignment.findOneAndUpdate(
                {
                    taskId: submission.taskId,
                    internId: submission.internId
                },
                {
                    status: "completed"
                },
                { new: true }
            );
            console.log('Assignment updated:', updatedAssignment);
        }

        res.json(ResObj(true, "Reviewed successfully", submission));

    } catch (error) {
        console.error('Review submission error:', error);
        res.status(500).json(ResObj(false, error.message));
    }
};

module.exports = {
    submitTask,
    getMySubmissions,
    getAllSubmissions,
    reviewSubmission
};