const API_URL = "http://localhost:5000/api";

export async function getDiscussions() {
  const response = await fetch(`${API_URL}/discussions`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load discussions."
    );
  }

  return data;
}

export async function getDiscussionCategories() {
  const response = await fetch(
    `${API_URL}/discussions/categories`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load discussion categories."
    );
  }

  return data;
}

export async function getDiscussion(id) {
  const response = await fetch(
    `${API_URL}/discussions/${id}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load discussion."
    );
  }

  return data;
}

export async function createDiscussion(
  discussionData,
  token
) {
  const response = await fetch(
    `${API_URL}/discussions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(discussionData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to create discussion."
    );
  }

  return data;
}

export async function createReply(
  discussionId,
  content,
  token
) {
  const response = await fetch(
    `${API_URL}/discussions/${discussionId}/replies`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to add reply."
    );
  }

  return data;
}