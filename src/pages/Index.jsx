import { useEffect, useState } from "react";
import { Container, Text, VStack, Spinner, Box, Link, Heading } from "@chakra-ui/react";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();
        const top10Ids = storyIds.slice(0, 10);

        const storyPromises = top10Ids.map(async (id) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return await storyResponse.json();
        });

        const stories = await Promise.all(storyPromises);
        setStories(stories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top stories:", error);
        setLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">Hacker News Top Stories</Heading>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          stories.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" w="100%">
              <Link href={story.url} isExternal>
                <Text fontSize="lg" fontWeight="bold">{story.title}</Text>
              </Link>
              <Text fontSize="sm" color="gray.500">by {story.by}</Text>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Index;