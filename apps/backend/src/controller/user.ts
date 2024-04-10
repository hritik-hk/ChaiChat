import express from "express";

export const fetchUserInfo = async (
  req: express.Request,
  res: express.Response
) => {
  const { username, email } = req.body.user;

  try {
    res.status(200).json({ username, email });
  } catch (err) {
    res.sendStatus(500).json({ error: err });
  }
};
