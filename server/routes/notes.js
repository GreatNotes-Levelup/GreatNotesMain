import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json([
    {
      title: "Note 1",
      text: "Some text",
    },
    {
      title: "Note 2",
      text: "Some text",
    },
  ]);
});

export default router;
