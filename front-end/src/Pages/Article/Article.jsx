import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Article = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen py-10">
      <div className="container mx-auto px-5">
        <Button
          variant="ghost"
          className="mb-5"
          onClick={() => navigate(-1)} // Go back to the previous page
        >
          ← Back
        </Button>
        <Card className="overflow-hidden">
          <img
            src="./pic.jpg"
            alt="Protecting Our Forests"
            className="w-full h-64 object-cover"
          />
          <CardContent className="p-6">
            <h1 className="text-4xl font-extrabold text-foreground mb-4">
              Protecting Our Forests
            </h1>
            <p className="text-muted-foreground mb-6">
              By John Doe | October 5, 2024
            </p>
            <div className="prose prose-invert max-w-none text-lg leading-relaxed">
              <p>
                Forests are one of the most vital ecosystems on our planet. They
                provide oxygen, store carbon, and house a diverse range of
                species. However, deforestation and habitat destruction have
                placed immense pressure on these natural wonders.
              </p>
              <p>
                Efforts to preserve forests worldwide are gaining momentum. From
                local conservation programs to international treaties, every
                step counts in combating deforestation. Protecting our forests
                is not just an environmental issue—it's a necessity for the
                future of humanity and countless other species.
              </p>
              <h2 className="text-2xl font-semibold mt-6">
                Key Initiatives
              </h2>
              <ul>
                <li>Reforestation programs in Amazon rainforests.</li>
                <li>Promoting sustainable logging practices.</li>
                <li>Raising awareness about the importance of biodiversity.</li>
              </ul>
              <p>
                We must all play our part in ensuring that forests are preserved
                for generations to come. Every action, no matter how small, can
                make a difference in protecting our planet's green lungs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Article;
